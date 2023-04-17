from calc_info_gain import calc_info_gain


def find_most_informative_feature(train_data, feature_list, class_list):
    """Finds the most informative feature from a list of features in a given dataset.

    :param train_data: Dict
    :param feature_list: List
    :param class_list: List
    :return: A string with the name of most informative feature.
    """
    max_info_gain = 0
    max_info_feature = None
    i = 0

    # ------ Obliczanie wartości informacyjnej dla każdego atrybutu
    for feature in feature_list:
        i += 1
        feature_info_gain = calc_info_gain(feature, train_data, class_list)

        if max_info_gain < feature_info_gain:
            max_info_gain = feature_info_gain
            max_info_feature = feature
    return max_info_feature
