# start

1. Bring up the cluster like usual.

    ```MYSECRET=secret ``` 

    ``` INT_IP=`ip a | grep wlo1 | grep inet | awk '{print $2}' | awk -F'/' '{print $1}'` 

   ```  curl -fL https://get.k3s.io | K3S_TOKEN=${MYSECRET} sh -s - --disable traefik server  --write-kubeconfig-mode 644 --node-ip $INT_IP ``` 

     ``` export KUBECONFIG=/etc/rancher/k3s/k3s.yaml ```

2. Add ns, regcred.

    ```kc apply -f 00-namespaces.yaml ``` 

    ``` kc create secret generic regcred --from-file=.dockerconfigjson=/home/mads/.docker/config.json --type=kubernetes.io/dockerconfigjson -n chat ```

3. Enable nginx ingress controller.

    ``` bash ./nginx-ingress-controller-manifests/deploy-nginx-ingress.sh ```

    ``` kc apply -f 01-nginx-ingress*.yaml ```

Wait till it starts ( ` kc get svc -n ingress-nginx ` ).

    ` kkk port-forward service/chat-service -n chat 8888:80 `
or

    ` curl --resolve "madsuchat.com:80:$INT_IP" -i madsuchat.com `



# adding monitoring

    ` helm install kps -n monitoring prometheus-community/kube-prometheus-stack `

Edited grafana service to be nodeport type so it runs on madsuchat.com:30001

# adding metrics

helm install -f metrics.yaml metrics bitnami/metrics-server --version 6.4.3
#kc edit deployment metrics-metrics-server, add a flag --kubelet-insecure-tls=true

# adding monitoring


kc get secret -n monitoring kps-grafana -o jsonpath='{.data.admin-user}' | base64 -d
kc get secret -n monitoring kps-grafana -o jsonpath='{.data.admin-password}' | base64 -d

kc port-forward -n monitoring svc/kps-kube-prometheus-stack-prometheus 9090:9090
kc port-forward -n monitoring svc/kps-grafana 8080:80
#log in as admin/prom-operator



*** Adding monitoting
    
    $ helm install kps -n monitoring prometheus-community/kube-prometheus-stack
    $ kc get all -n monitoring
Get the creds:
    $ kc get secret -n monitoring kps-grafana -o jsonpath='{.data.admin-user}' | base64 -d
    $ kc get secret -n monitoring kps-grafana -o jsonpath='{.data.admin-password}' | base64 -d

    $ kc port-forward -n monitoring svc/kps-kube-prometheus-stack-prometheus 9090:9090
Open localhost:9090
    $ kc port-forward -n monitoring svc/kps-grafana 8080:80
Open localhost:8080, log in as admin/prom-operator



                                                            ==== RBAC FUCKERY ====

1. Generate key and csr with openssl:
    $ mkdir ~/kubecert_practice
    $ openssl genrsa -out jerry.key 2048
    $ openssl req -new -key jerry.key -out jerry.csr -subj "/CN=Jerry/O=Devs"

Copy the minikube certs to pwd:
    $ cp ~/.minikube/ca.key .
    $ cp ~/.minikube/ca.pem .
    $ cp ~/.minikube/ca.crt .

Use the generated csr, the copied ca.crt, and ca.key to generate a user crt with openssl:
    $ openssl x509 -req -in jerry.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out jerry.crt -days 1

Kubeconfig is at ~/.kube/config, note the server ip (for minikube it's https://192.168.49.2:8443)

2. For convenience, create a new kubeconfig file for a new cluster:
    $ export KUBECONFIG=~/.kube/new-config