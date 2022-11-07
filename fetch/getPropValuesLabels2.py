import os.path
import time
import json
import itertools
from os import walk

from qwikidata.entity import WikidataItem
from qwikidata.json_dump import WikidataJsonDump

propEntities = set([])

propEntitiesPath = "../resources/propEntities/propEntities.json"

# Możliwość wygenerowania pliku, jeżeli nie istnieje

if os.path.isfile("../resources/propEntities/propEntities.json"):
    with open("../resources/propEntities/propEntities.json") as file:
        propEntities = set(json.loads(file.read()))
else:

    mypath = "../resources"
    filenames = next(walk(mypath), (None, None, []))[2]

    for filename in filenames:
        with open(f"../resources/{filename}") as f:
            entities = json.loads(f.read())
            for i in entities:
                for claim in i['claims']:
                    # print(claim, i['claims'][claim])
                    for value in i['claims'][claim]:
                        # print(value, claim)
                        if value['datatype'] == 'wikibase-item':
                            if value['datavalue']['id'] not in propEntities:
                                propEntities.add(value['datavalue']['id'])
                # print(j, len(propEntities))
        print(f"done {filename} ", len(propEntities))

    with open("../resources/propEntities/propEntities.json", "w") as f:
        f.write(json.dumps(list(propEntities)))

wjd_dump_path = "../latest-all.json.bz2"
wjd = WikidataJsonDump(wjd_dump_path)

wjd_iterator = wjd.iter_lines()

# dictn - nr pliku wygenerowanego z tego programu
# dicts - nr seryjny plików dla tego programu
# n - liczba obiektów do pominięcia

dictn = 0
dicts = 1
n = 50000000

maxrange = 60000000

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
    try:
        entity_dict = json.loads(entity_dict[0])
    except json.decoder.JSONDecodeError:
        fname = f"../resources/propValues/propValues{dicts}_{dictn}.json"
        with open(fname, "w") as file:
            file.write(json.dumps(labels))
        dictn += 1
        print("Saved to " + fname)
        print("Done!")
        labels = []
        break


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
