from qwikidata.sparql import (get_subclasses_of_item,
                              return_sparql_query_results)
import json
import requests
import time

WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"

# send any sparql query to the wikidata query service and get full result back
# here we use an example that counts the number of humans
sparql_query = r"""
SELECT DISTINCT ?item
WHERE {
  ?item wdt:P31 wd:Q5 ;
        wdt:P214 []
}
LIMIT 1800000
"""
# res = json.dump(return_sparql_query_results(sparql_query), )
# res = return_sparql_query_results(sparql_query)
res = requests.get(WIKIDATA_SPARQL_URL, params={"query": sparql_query, "format": "json"})
print(res)
print(res.content)
print(json.loads(res.content)['results']['bindings'])
rawContent = json.loads(res.content)['results']['bindings']
with open("data.txt", mode="w") as data:
    data.write(res.content.decode("utf-8"))
    data.close()

# print(len(res.json()['results']['bindings']))
# for i in res['results']['bindings']:
#     # time.sleep(1.0)
#     print(i['itemLabel']['value'])
#     sparql_labels = r"""
#     SELECT ?wdLabel ?ps_Label ?wdpqLabel ?pq_Label {
#       VALUES (?company) {(wd:"""+i['itemLabel']['value']+""")}
#
#       ?company ?p ?statement .
#       ?statement ?ps ?ps_ .
#
#       ?wd wikibase:claim ?p.
#       ?wd wikibase:statementProperty ?ps.
#
#       OPTIONAL {
#       ?statement ?pq ?pq_ .
#       ?wdpq wikibase:qualifier ?pq .
#       }
#
#       SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
#     } ORDER BY ?wd ?statement ?ps_
#     """
#     res2 = requests.get(WIKIDATA_SPARQL_URL, params={"query": sparql_labels, "format": "json"})
#     print(res2)
#     print(res2['results']['bindings'])
#     print(sparql_labels)


# use convenience function to get subclasses of an item as a list of item ids
# Q_RIVER = "Q4022"
# subclasses_of_river = get_subclasses_of_item(Q_RIVER)
# print(subclasses_of_river)

# SELECT DISTINCT ?item ?itemLabel WHERE {
#   SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
#   {
#     SELECT DISTINCT ?item WHERE {
#       ?item p:P31 ?statement0.
#       ?statement0 (ps:P31/(wdt:P279*)) wd:Q5.
#     }
#     LIMIT 100
#   }
# }