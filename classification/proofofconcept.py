import gc
import time

import psycopg2 as pg
import numpy as np
import scipy.sparse
import pandas as pd
import datetime
from memory_profiler import profile

# @profile
def main():
    def castDate(value, cur):
        if value is not None:
            if "BC" in value:
                return int(value.split("-")[0]) * -1
            else:
                return int(value.split("-")[0])
            # return year
        else:
            return None

    DATE = pg.extensions.new_type((1082,), "DATE", castDate)
    pg.extensions.register_type(DATE)

    DB_HOST = 'localhost'
    DB_USER = 'postgres'
    DB_PASSWORD = 'tajne'
    DB_NAME = 'testdb'

    def calc_total_entropy(train_data, label, class_list):
        total_row = train_data.shape[0]  # the total size of the dataset
        total_entr = 0

        for c in class_list:  # for each class in the label
            total_class_count = train_data[train_data[label] == c].shape[0]  # number of the class
            total_class_entr = - (total_class_count / total_row) * np.log2(
                total_class_count / total_row)  # entropy of the class
            total_entr += total_class_entr  # adding the class entropy to the total entropy of the dataset

        return total_entr

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
    limit 2500000;"""

    cur = conn.cursor(name="columncursor")
    cur.execute(columnQuery)

    result = cur.fetchall()
    result = list(map(lambda x: x[2], result))
    label = result[0]
    features = result[2:]
    print(label)


    # ----------------------------------------------------------------
    # trzeba ściągnąć wszystkie osoby
    # może do pliku albo cos takiego
    # spróbować z samym ściąganiem wszyskich QID, a osób mniej
    # może nie trzeba całego ID3, tylko tyle by podzielił
    # ----------------------------------------------------------------


    class_list = []
    all = {}
    cur = conn.cursor(name="humanscursor")
    cur.execute(humansquery)

    for i in range(0, 25):
        result = cur.fetchmany(100000)
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
        print(i)
    # class_list += list(map(lambda x: x[0], result))
    # gc.collect()
    # print(date_oid)
    # while True:
    #     try:
    #         result = cur.fetchone()
    #         print(result[0])
    #     except ValueError as e:
    #         print(e)
    # class_list = list(map(lambda x: x[0], result))
    print(len(class_list))
    # print(all)
    # time.sleep(10)
    cur.close()
    conn.close()


main()