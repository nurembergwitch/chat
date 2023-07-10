#!/usr/bin/bash
LOCAL_IP=`ip a | grep wlo1 | grep inet | awk '{print $2}' | awk -F'/' '{print $1}'`

MYSECRET=epsteindidntkillhimself

# curl -sfL https://get.k3s.io | K3S_TOKEN=${MYSECRET} sh -s - --disable traefik --write-kubeconfig-mode 644 --node-ip ${LOCAL_IP}

curl -fL https://get.k3s.io | K3S_TOKEN=${MYSECRET} sh -s - --disable traefik server --write-kubeconfig-mode 644 --node-ip ${LOCAL_IP}