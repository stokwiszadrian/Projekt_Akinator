import json
import requests
import time

WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"

with open("data.txt") as data:
    res = data.read()
    res = json.loads(res)
    print(res)
    for i in res['results']['bindings']:
        time.sleep(1.0)
        label = i['item']['value'].replace('http://www.wikidata.org/entity/', '')
        print(label)
        sparql_labels = r"""
        SELECT ?wdLabel ?ps_Label ?wdpqLabel ?pq_Label {
          VALUES (?company) {(wd:"""+label+""")}

          ?company ?p ?statement .
          ?statement ?ps ?ps_ .

          ?wd wikibase:claim ?p.
          ?wd wikibase:statementProperty ?ps.

          OPTIONAL {
          ?statement ?pq ?pq_ .
          ?wdpq wikibase:qualifier ?pq .
          }

          SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
        } ORDER BY ?wd ?statement ?ps_
        """
        res2 = requests.get(WIKIDATA_SPARQL_URL, params={"query": sparql_labels, "format": "json"})
        print(res2)
        # print(res2.json()['results']['bindings'])