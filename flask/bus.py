import random

def get_bus_info(station):
    info = []
    for random_bus in range(10):
        bus_name = f"W{random.randint(1, 100)}"
        bus_arrival_time = random.randint(1, 30)
        bus_info = f"{bus_name} 还有 {bus_arrival_time} 分钟到达 {station}"
        bus_info=bus_info.encode("utf-8").decode("utf-8")
        info.append({bus_name: bus_info})
    return info

get_bus_info('天安门')