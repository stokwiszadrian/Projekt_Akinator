import time
import json
import itertools

from qwikidata.entity import WikidataItem
from qwikidata.json_dump import WikidataJsonDump
from qwikidata.utils import dump_entities_to_json

P_INSTANCEOF = "P31"
Q_HUMAN = "Q5"


def instanceof_human(item: WikidataItem, truthy: bool = True) -> bool:
    """Return True if the Wikidata Item has occupation politician."""
    if truthy:
        claim_group = item.get_truthy_claim_group(P_INSTANCEOF)
    else:
        claim_group = item.get_claim_group(P_INSTANCEOF)

    instanceof_qids = [
        claim.mainsnak.datavalue.value["id"]
        for claim in claim_group
        if claim.mainsnak.snaktype == "value"
    ]
    return Q_HUMAN in instanceof_qids


wjd_dump_path = "../latest-all.json.bz2"
wjd = WikidataJsonDump(wjd_dump_path)

wjd_iterator = wjd.iter_lines()

# dictn - nr pliku wygenerowanego z tego programu
# dicts - nr seryjny plików dla tego programu
# n - liczba obiektów do pominięcia

dictn = 0
dicts = 1
n = 10000001

maxrange = 10000000

print(f"SEARCH {n} - {n+maxrange}")

for i in range(0, n):
    wjd_iterator.__next__()

humans = []
snak_datatypes = ['wikibase-item', 'string', 'time', 'monolingualtext', 'quantity']
t1 = time.time()


ii = 0

for entity_dict in wjd_iterator:
    entity_dict = entity_dict.rsplit(",", 1)

    # len = 1 gdy mamy do czynienia z początkiem listy
    if len(entity_dict) == 1:
        continue

    entity_dict = json.loads(entity_dict[0])

    if entity_dict["type"] == "item":
        entity = WikidataItem(entity_dict)
        if instanceof_human(entity):
            claims = entity.get_truthy_claim_groups()
            props = {}
            for key in claims.keys():
                ind = claims[key]._claims
                claims_formatted = []
                for claim in ind:
                    snak_datatype = claim.mainsnak.snak_datatype
                    if snak_datatype not in snak_datatypes or claim.mainsnak.snaktype != "value":
                        continue
                    else:
                        claims_formatted.append({
                            "datatype": snak_datatype,
                            "datavalue": claim.mainsnak.datavalue.value
                        })
                if len(claims_formatted) > 0:
                    props[key] = claims_formatted

            entry = {
                "id": entity.entity_id,
                "label": entity.get_label("en"),
                "claims": props
            }
            humans.append(entry)

    if ii % 10000 == 0:
        t2 = time.time()
        dt = t2 - t1
        local = time.localtime()
        print(local[3], local[4], local[5])
        print(
            "found {} humans among {} entities [entities/s: {:.2f}]".format(
                len(humans), ii, ii / dt
            )
        )
        if len(humans) > 100000:
            fname = f"../resources/humans{dicts}_{dictn}.json"
            with open(fname, "w") as file:
                file.write(json.dumps(humans))
            dictn += 1
            print("Saved to "+fname)
            humans = []
    ii += 1

    if ii > maxrange:
        fname = f"../resources/humans{dicts}_{dictn}.json"
        with open(fname, "w") as file:
            file.write(json.dumps(humans))
        dictn += 1
        print("Saved to " + fname)
        humans = []
        break


# load filtered entities and create instances of WikidataItem
# for ii, entity_dict in enumerate(wjd_filtered):
#     item = WikidataItem(entity_dict)