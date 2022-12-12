import numpy as np

# USTAWIONE DLA QID - JEDNO QID NA CALY DATASET

def calc_total_entropy(train_data, label, class_list):
    total_row = len(train_data.keys())  # the total size of the dataset
    total_entr = 0

    for c in class_list:  # for each class in the label

        total_class_count = 1  # number of the class
        total_class_entr = - (total_class_count / total_row) * np.log2(
            total_class_count / total_row)  # entropy of the class
        total_entr += total_class_entr  # adding the class entropy to the total entropy of the dataset

    return total_entr
