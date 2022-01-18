import cv2


def get_human_number(file):
    gray = cv2.cvtColor(file, cv2.COLOR_BGR2GRAY)

    faces = cv2.CascadeClassifier('faces.xml')

    results = faces.detectMultiScale(gray, scaleFactor=1.6, minNeighbors=4)
    return len(results)