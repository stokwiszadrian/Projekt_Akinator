
def calc_info_gain(feature_name, train_data, class_list):
    feature_value_list = [None]
    feature_count = 0
    for c in class_list:
        feature_value = train_data[c].get(feature_name, None)
        # ------ Uwzględniamy również wartości puste
        if feature_value is None:
            if "None" not in feature_value_list:
                feature_value_list.append("None")
                feature_count += 1
        elif isinstance(feature_value, str):
            if "|" in feature_value:
                splits = feature_value.split(" | ")
                for split in splits:
                    feature_value_list.append(split)
            else:
                feature_value_list.append(feature_value)
            feature_count += 1
        # ------ Typy inne niż String są ignorowane
        else:
            return -1
    feature_value_list = list(set(feature_value_list))

    # ------ Ignorujemy przypadki gdy kolumna dla wszystkich jest pusta
    if len(feature_value_list) == 0:
        return -1
    else:
        # ------ "Info gain" jest równy liczbie osób z tym atrybutem
        # ------ podzielony przez liczbe unikalnych wartości tego atrybutu
        return feature_count / len(feature_value_list)

