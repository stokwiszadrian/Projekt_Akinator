def calc_info_gain(feature_name, train_data, class_list):
    """Calculates the information gain of the feature in a given dataset.

    Information gain is calculated by dividing the number of classes by the number of unique
    values for a given feature. If the feature does not have a value for any class, the function returns -1.

    :param feature_name: String
    :param train_data: Dict
    :param class_list: List
    :return: Float
    """
    feature_value_list = [None]
    feature_count = 0
    append = feature_value_list.append
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

    if len(feature_value_list) == 0:
        return -1
    else:
        return feature_count / len(feature_value_list)

