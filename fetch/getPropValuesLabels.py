import os.path
import time
import json
from os import walk

from qwikidata.entity import WikidataItem
from qwikidata.json_dump import WikidataJsonDump

propEntities = set([])
propertyList = set([])
propEntitiesPath = "../resources/propEntities/propEntities.json"

# Możliwość wygenerowania pliku, jeżeli nie istnieje
if os.path.isfile("../resources/propEntities/propEntities.json"):
    print("PropEntities found")
    with open("../resources/propEntities/propEntities.json") as file:
        propEntities = set(json.loads(file.read()))
else:
    print("PropEntities not found. Creating new file...")
    mypath = "../resources/humans"
    filenames = next(walk(mypath), (None, None, []))[2]

    for filename in filenames:
        print(filename)
        with open(mypath + "/" + filename) as f:
            entities = json.loads(f.read())
            for i in entities:
                for claim in i['claims']:

                    if claim not in propertyList:
                        propertyList.add(claim)

                    for value in i['claims'][claim]:
                        if value['datatype'] == 'wikibase-item':
                            if value['datavalue']['id'] not in propEntities:
                                propEntities.add(value['datavalue']['id'])
        print(f"done {filename} ", len(propEntities), len(propertyList))

    with open("../resources/propEntities/propEntities.json", "w") as f:
        f.write(json.dumps(list(propEntities)))

    with open("../resources/itemProps/humanItemProps.json", "w") as f:
        f.write(json.dumps(list(propertyList)))

wjd_dump_path = "../latest-all.json.bz2"
wjd = WikidataJsonDump(wjd_dump_path)

wjd_iterator = wjd.iter_lines()

# dictn - nr pliku wygenerowanego z tego programu
# dicts - nr seryjny plików dla tego programu
# n - liczba obiektów do pominięcia
# maxrange - liczba obiektów, przy której program zatrzyma działanie
# całkowita liczba rekordów "przejrzana" przez program = maxrange - n
# liczba rekordów w dumpie =~ 110mln

dictn = 0
dicts = 0
n = 0
maxrange = 50000000

print(f"SEARCH {n} - {n+maxrange}")

for i in range(0, n):
    wjd_iterator.__next__()

labels = []
t1 = time.time()
ii = 0

for entity_dict in wjd_iterator:
    entity_dict = entity_dict.rsplit(",", 1)

    # len = 1 gdy mamy do czynienia z początkiem listy
    if len(entity_dict) == 1:
        continue

    entity_dict = json.loads(entity_dict[0])
    if entity_dict['id'] in propEntities:
        entity = WikidataItem(entity_dict)
        entry = {
            "id": entity.entity_id,
            "label": entity.get_label("en"),
        }
        labels.append(entry)

    if ii % 10000 == 0:
        t2 = time.time()
        dt = t2 - t1
        local = time.localtime()
        print(local[3], local[4], local[5])
        print(
            "found {} propEntities among {} entities [entities/s:]".format(
                len(labels), ii
            )
        )
        if len(labels) > 100000:
            fname = f"../resources/propValues/propValues{dicts}_{dictn}.json"
            with open(fname, "w") as file:
                file.write(json.dumps(labels))
            dictn += 1
            print("Saved to "+fname)
            labels = []
    ii += 1

    if ii > maxrange:
        fname = f"../resources/propValues/propValues{dicts}_{dictn}.json"
        with open(fname, "w") as file:
            file.write(json.dumps(labels))
        dictn += 1
        print("Saved to " + fname)
        labels = []
        break
