import numpy as np

# USTAWIONE DLA QID - JEDNO QID NA CALY DATASET


def calc_entropy(feature_value_data, label, class_list):
    class_count = len(feature_value_data.keys())
    entropy = 0

    for c in class_list:
        label_class_count = 1  # row count of class c
        entropy_class = 0
        if label_class_count != 0:
            probability_class = label_class_count / class_count  # probability of the class
            entropy_class = - probability_class * np.log2(probability_class)  # entropy
        entropy += entropy_class
    return entropy