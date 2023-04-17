import gc
import sys
import json
import psycopg2 as pg
from make_tree import make_tree

sys.setrecursionlimit(10000)


def castDate(value, cur):
    if value is not None:
        if "BC" in value:
            return int(value.split("-")[0]) * -1
        else:
            return int(value.split("-")[0])
    else:
        return None


def gen_decision_tree(num_entries=100000):
    """Connects to the postgres database, fetches the desired number of entries and generates a decision tree.
    The tree will be saved at *../resources/decision_tree.json*

    Note that the entries are sorted and fetched based on their QID length, with lower QID length usually meaning a
    person with more and better described features.

    :param num_entries: The number of entries to use. Defaults to 100 000. Cannot be lower than 10.
    """
    #

    DATE = pg.extensions.new_type((1082,), "DATE", castDate)
    pg.extensions.register_type(DATE)

    DB_HOST = 'localhost'
    DB_USER = 'postgres'
    DB_PASSWORD = 'tajne'
    DB_NAME = 'projectdb'

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

    print(f"Generating a tree for {num_entries} humans")

    cur = conn.cursor(name="columncursor")
    cur.execute(columnQuery)

    result = cur.fetchall()
    result = list(map(lambda x: x[2], result))
    features = result[2:]

    class_list = []
    all = {}
    cur = conn.cursor(name="humanscursor")
    cur.execute(humansquery)

    for v in range(0, 10):
        result = cur.fetchmany(int(num_entries / 10))
        print(len(result), v)
        class_list += list(map(lambda x: x[0], result))
        for entry in result:
            all[entry[0]] = {}
            for j in range(2, len(features) + 2):
                if entry[j] is not None:
                    all[entry[0]][features[j - 2]] = entry[j]
        del result
    gc.collect()
    result = cur.fetchmany(num_entries % 10)
    print(len(result))
    class_list += list(map(lambda x: x[0], result))
    for entry in result:
        all[entry[0]] = {}
        for j in range(2, len(features) + 2):
            if entry[j] is not None:
                all[entry[0]][features[j - 2]] = entry[j]
    del result
    decision_tree = {}
    train_data = all.copy()
    make_tree(decision_tree, None, train_data, class_list, features)
    print("Decision tree generated")
    with open("../resources/decision_tree.json", "w") as f:
        json.dump(decision_tree, f)

    cur.close()
    conn.close()


if __name__ == "__main__":
    import sys
    try:
        entries = int(sys.argv[1])
        gen_decision_tree(entries)
    except ValueError as v:
        print("Invalid argument for num_entries, defaulting to 100 000")
        gen_decision_tree(100000)
    except IndexError as v:
        print("Defaulting to 100 000 entries")
        gen_decision_tree(100000)

