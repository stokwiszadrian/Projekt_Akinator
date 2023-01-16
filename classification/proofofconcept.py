import gc
import time
import sys
import json
import psycopg2 as pg
import numpy as np
import scipy.sparse
import pandas as pd
import datetime
from os import path

import generate_sub_tree
from calc_total_entropy import calc_total_entropy as total_entropy_calc
from calc_entropy import calc_entropy as entropy_calc
from calc_info_gain import calc_info_gain
from find_most_informative_feature import find_most_informative_feature
from leaf_nodes_count import leaf_nodes_per_key, best_prop_value, get_subtree
from id3 import id3
from predict import predict
# from memory_profiler import profile
from flask import Flask, request
from flask_cors import CORS, cross_origin
import requests

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
    if path.exists("decision_tree.json"):
        with open("decision_tree.json", "r") as f:
            decision_tree = json.load(f)
            app = Flask(__name__)
            cors = CORS(app)
            app.config['CORS_HEADERS'] = 'Content-Type'

            @app.route('/', methods=['POST'])
            @cross_origin()
            def get_next_prop():
                body = request.get_json()
                answered_yes = body["answered_yes"]
                instance = body["instance"]
                excluded = body["excluded"]

                if len(instance.keys()) == 0:
                        subtree = leaf_nodes_per_key(decision_tree, True)
                        if len(excluded) == 0:
                            best_prop, best_value = best_prop_value(subtree)
                        else:
                            best_prop, best_value = best_prop_value(subtree, excluded)
                        return {
                            "question": f"question about {best_value} ?",
                            "value": {
                                best_prop: best_value
                            }
                        }

                else:
                    subtree = get_subtree(decision_tree, instance)
                    print(subtree)
                    if isinstance(subtree, str):
                        person_label = requests.get(f"http://localhost:4000/api/humans/byqid/{subtree}").json()["label"]

                        return {
                            "question": f"{person_label}",
                            "value": {
                                "guess": person_label
                            }
                        }
                    else:
                        counted = leaf_nodes_per_key(subtree, True)
                        if answered_yes:
                            best_prop, best_value = best_prop_value(counted)
                        else:
                            best_prop, best_value = best_prop_value(counted, excluded)
                        prop_label = requests.get(f"http://localhost:4000/api/proplabels/bypid/{best_prop}").json()["prop_label"]
                        if best_value != "None":
                            print(best_value)
                            value_label = requests.get(f"http://localhost:4000/api/entlabels/byqid/{best_value}").json()["label"]
                        else:
                            value_label = best_value
                        return {
                            "question": f"{prop_label}:  {value_label} ?",
                            "value": {
                                best_prop: best_value
                            }
                        }


            app.run(debug=True)
    else:
        DATE = pg.extensions.new_type((1082,), "DATE", castDate)
        pg.extensions.register_type(DATE)

        DB_HOST = 'localhost'
        DB_USER = 'postgres'
        DB_PASSWORD = 'tajne'
        DB_NAME = 'akinatordb'

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
        with open("decision_tree.json", "w") as f:
            json.dump(decision_tree, f)
        adenauer = {
            "p21": "Q6581097",
            "p31": "Q5",
            "p7763": "Q73555012",
            "p1196": "Q10737",
            "p2650": "Q329618"

        }
        print("PREDICTED VALUE: ", predict(decision_tree, adenauer))
        # subtree = generate_sub_tree.generate_sub_tree(most_informative_feature, all, 'qid', class_list)
        # print("SUBTREE: \n", subtree)
        cur.close()
        conn.close()
