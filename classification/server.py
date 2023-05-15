import re
import sys
import json
from os import path
from leaf_nodes_count import leaf_nodes_per_key, best_prop_value, get_subtree
from flask import Flask, request
from flask_cors import CORS, cross_origin
import requests


sys.setrecursionlimit(10000)

api_url = 'http://localhost:4000/'

treepath = "../resources/decision_tree.json"

if __name__ == "__main__":
    if path.exists(treepath):
        with open(treepath, "r") as f:
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

                    response = requests.get(f"{api_url}api/proplabels/bypid/{best_prop}").json()
                    prop_label = response['prop_label']
                    question = response['question']
                    if best_value is None:
                        return {
                            "question": f"Person not found",
                            "value": {
                                "guess": best_value
                            }
                        }
                    if best_value != "None":
                        matchstring = 'Q[0-9][0-9]*'
                        if re.search(matchstring, best_value) is not None:
                            try:
                                value_label = requests.get(f"{api_url}api/entlabels/byqid/{best_value}").json()["label"]
                            except requests.exceptions.JSONDecodeError as e:
                                value_label = best_value
                        else:
                            value_label = best_value
                    else:
                        return {
                            "question": f"Is {prop_label} unknown / not important for this person ?",
                            "value": {
                                best_prop: best_value
                            }
                        }
                    question = question.replace("QQ", value_label)
                    return {
                        "question": question,
                        "value": {
                            best_prop: best_value
                        }
                    }

                else:
                    subtree = get_subtree(decision_tree, instance)
                    if isinstance(subtree, str):
                        person_label = requests.get(f"{api_url}api/humans/byqid/{subtree}").json()["label"]

                        return {
                            "question": f"{person_label}",
                            "value": {
                                "guess": subtree
                            }
                        }
                    else:
                        counted = leaf_nodes_per_key(subtree, True)
                        if answered_yes:
                            best_prop, best_value = best_prop_value(counted)
                        else:
                            best_prop, best_value = best_prop_value(counted, excluded)
                        response = requests.get(f"{api_url}api/proplabels/bypid/{best_prop}").json()
                        prop_label = response['prop_label']
                        question = response['question']
                        if best_value is None:
                            return {
                                "question": f"Person not found",
                                "value": {
                                    "guess": best_value
                                }
                            }
                        if best_value != "None":

                            matchstring = 'Q[0-9][0-9]*'
                            if re.search(matchstring, best_value) is not None:
                                try:
                                    value_label = requests.get(f"{api_url}api/entlabels/byqid/{best_value}").json()["label"]
                                except requests.exceptions.JSONDecodeError as e:
                                    value_label = best_value
                            else:
                                value_label = best_value
                        else:
                            return {
                                "question": f"Is {prop_label} unknown / not important for this person ?",
                                "value": {
                                    best_prop: best_value
                                }
                            }

                        question = question.replace("QQ", value_label)
                        return {
                            "question": question,
                            "value": {
                                best_prop: best_value
                            }
                        }


            app.run(debug=True)
    else:
        print("Missing the decision_tree.json file")
