import socket

client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)


server_address = ('localhost', 7777)

message = 'Hello, server'.encode()

try:
    sent = client_socket.sendto(message, server_address)

    data, server = client_socket.recvfrom(4096)

    print(data.decode())

finally:
    print('Закрытие сокета')
    client_socket.close()