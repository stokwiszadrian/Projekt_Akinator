import numpy as np


def calc_info_gain(feature_name, train_data, class_list):
    feature_value_list = [None]
    feature_count = 0
    append = feature_value_list.append
    # for idx in np.arange(0, len(class_list)):
    #     try:
    #         feature_value = train_data[class_list[idx]][feature_name]
    for c in class_list:
        try:
            feature_value = train_data[c][feature_name]
            if "|" in feature_value:
                splits = feature_value.split(" | ")
                for split in splits:
                    append(split)
            else:
                append(feature_value)
            feature_count += 1
        except KeyError as k:
            if "None" not in feature_value_list:
                append("None")
                feature_count += 1

    feature_value_list = list(set(feature_value_list))

    # ------ Ignorujemy przypadki gdy kolumna dla wszystkich jest pusta
    if len(feature_value_list) == 0:
        return -1
    else:
        # ------ "Info gain" jest równy liczbie osób z tym atrybutem
        # ------ podzielony przez liczbe unikalnych wartości tego atrybutu
        return feature_count / len(feature_value_list)

