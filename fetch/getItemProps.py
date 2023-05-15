import json
import requests


WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"

sparql_query = r"""
SELECT ?property ?propertyLabel ?propertyType WHERE {
    ?property wikibase:propertyType ?propertyType .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
ORDER BY ASC(xsd:integer(STRAFTER(STR(?property), "P")))
"""

datatypes = ['WikibaseItem', 'String', 'Monolingualtext']

proplist = {}
res = requests.get(WIKIDATA_SPARQL_URL, params={"query": sparql_query, "format": "json"})
rawContent = json.loads(res.content)

for prop in rawContent['results']['bindings']:
    proptype = prop['propertyType']['value'].replace('http://wikiba.se/ontology#', '')
    if proptype in datatypes:
        key = prop['property']['value'].replace('http://www.wikidata.org/entity/', '')
        proplist[key] = {
            "label": prop['propertyLabel']['value'].encode('ascii', 'ignore').decode(),
            "type": proptype
            }


with open("../resources/itemProps/itemProps.json", mode="w") as data:
    data.write(json.dumps(proplist))
    data.close()

print("Stworzono ItemProps w lokalizacji ../resources/itemProps/itemProps.json")