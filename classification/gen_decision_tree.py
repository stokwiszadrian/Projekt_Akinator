import gc
import sys
import json
import psycopg2 as pg
from id3 import id3

sys.setrecursionlimit(10000)


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

    # ------ Zmienne połączenia z bazą danych

    DB_HOST = 'localhost'
    DB_USER = 'postgres'
    DB_PASSWORD = 'tajne'
    DB_NAME = 'db_from_restore'

    # ------ Ilość rekordów pobieranych "z wierzchu"

    num_entries = 100000

    conn = pg.connect(
        dbname=DB_NAME,
        user=DB_USER,
        host=DB_HOST,
        password=DB_PASSWORD
    )

    columnQuery = """
            select table_schema, table_name, column_name 
            from information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'humans';
            """

    humansquery = f"""
            select * from humans
            order by length(qid)
            limit {num_entries};"""

    # ------ Pobieranie nazw kolumn

    cur = conn.cursor(name="columncursor")
    cur.execute(columnQuery)

    result = cur.fetchall()
    result = list(map(lambda x: x[2], result))
    label = result[0]
    features = result[2:]
    print(label)

    # ------ Pobieranie rekordów osób

    class_list = []
    all = {}
    cur = conn.cursor(name="humanscursor")
    cur.execute(humansquery)

    result = cur.fetchall()
    class_list += list(map(lambda x: x[0], result))
    for entry in result:
        all[entry[0]] = {}
        for j in range(2, len(features) + 2):
            if entry[j] is not None:
                all[entry[0]][features[j - 2]] = entry[j]
    del result
    gc.collect()
    print("Human entries fetched")

    decision_tree = id3(all, "qid", class_list, features)
    print("Decision tree generated")
    with open("decision_tree.json", "w") as f:
        json.dump(decision_tree, f)

    cur.close()
    conn.close()
