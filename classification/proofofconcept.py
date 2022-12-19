import gc
import time
import sys

import psycopg2 as pg
import numpy as np
import scipy.sparse
import pandas as pd
import datetime

import generate_sub_tree
from calc_total_entropy import calc_total_entropy as total_entropy_calc
from calc_entropy import calc_entropy as entropy_calc
from calc_info_gain import calc_info_gain
from find_most_informative_feature import find_most_informative_feature
from id3 import id3
from predict import predict
# from memory_profiler import profile

sys.setrecursionlimit(10000)

# @profile
def castDate(value, cur):
    if value is not None:
        if "BC" in value:
            return int(value.split("-")[0]) * -1
        else:
            return int(value.split("-")[0])
        # return year
    else:
        return None


if __name__ == "__main__":

    DATE = pg.extensions.new_type((1082,), "DATE", castDate)
    pg.extensions.register_type(DATE)

    DB_HOST = 'localhost'
    DB_USER = 'postgres'
    DB_PASSWORD = 'tajne'
    DB_NAME = 'postgres'

    conn = pg.connect(
        dbname=DB_NAME,
        user=DB_USER,
        host=DB_HOST,
        password=DB_PASSWORD
    )

    # cur = conn.cursor(name = "serverside_cursor")
    columnQuery = """
    select table_schema, table_name, column_name 
    from information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'humans';
    """
    # countQuery = "select count(qid) as q from humans;"

    humansquery = """
    select * from humans
    order by length(qid)
    limit 1000;"""

    # order by length(qid)

    cur = conn.cursor(name="columncursor")
    cur.execute(columnQuery)

    result = cur.fetchall()
    result = list(map(lambda x: x[2], result))
    label = result[0]
    features = result[2:]
    print(label)

    class_list = []
    all = {}
    cur = conn.cursor(name="humanscursor")
    cur.execute(humansquery)

    result = cur.fetchall()
    # print(features)
    # print(result)
    class_list += list(map(lambda x: x[0], result))
    for entry in result:
        all[entry[0]] = {}
        for j in range(2, len(features) + 2):
            if entry[j] is not None:
                all[entry[0]][features[j - 2]] = entry[j]
    del result
    gc.collect()
    print("Human entries fetched")
    print(len(class_list))
    # print(all)
    # total_entropy = total_entropy_calc(all, "qid", class_list)
    # print("Total entropy: ", total_entropy)

    # p21 - sex or gender
    # Q6581097 - male
    # p27 - country of citizenship

    print(class_list)
    # print(all)
    decision_tree = id3(all, "qid", class_list, features)
    print("----------------------------- FINAL DECISION TREE -----------------------------")
    print(decision_tree)
    george_bush = {
        "p21": "Q6581097",
        "p31": "Q5",
        "p7763": "Q73555012",
        "p3438": "Q1025171"
    }
    print(predict(decision_tree, george_bush))
    # subtree = generate_sub_tree.generate_sub_tree(most_informative_feature, all, 'qid', class_list)
    # print("SUBTREE: \n", subtree)
    cur.close()
    conn.close()
