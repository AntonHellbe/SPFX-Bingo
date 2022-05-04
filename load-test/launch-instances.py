import click_tiles
#import subprocess
from multiprocessing import Pool
from subprocess import call
from config import config


if __name__ == '__main__':
    taskList = list()
    for i in range(1, 3):
        username = "test" + str(i) + "@devdomainer.onmicrosoft.com"
        task_str = "python3 click_tiles.py " + username + " " + config["password"] +  " " + str(i)
        taskList.append(task_str)
        print(task_str)

    Pool(2).map(call, [
        taskList[0], "1",
        taskList[1], "1",
    ])
    """
    #subprocess.call("python3 click_tiles.py test2@devdomainer.onmicrosoft.com Fabrik22")
    """