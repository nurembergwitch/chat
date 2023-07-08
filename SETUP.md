                            SETUP IN K3S
1. Bring up the cluster like usual.

    ` MYSECRET=cocaine `

    ` INT_IP=`ip a | grep wlo1 | grep inet | awk '{print $2}' | awk -F'/' '{print $1}'` `

    ` curl -fL https://get.k3s.io | K3S_TOKEN=${MYSECRET} sh -s - --disable traefik server  --write-kubeconfig-mode 644 --node-ip $INT_IP `

    ` export KUBECONFIG=/etc/rancher/k3s/k3s.yaml `

2. Add ns, regcred, the env variable.
    ` kkk apply -f 00-namespaces.yaml `

    ` kkk create secret generic regcred --from-file=.dockerconfigjson=/home/mads/.docker/config.json --type=kubernetes.io/dockerconfigjson -n chat `

3. Enable nginx ingress controller.

    ` bash ./nginx-ingress-controller-manifests/deploy-nginx-ingress.sh`

    ` kkk apply -f 01-nginx-ingress*.yaml`

Wait till it starts ( ` kkk get svc -n ingress-nginx ` ).

    ` kkk port-forward service/chat-service -n chat 8888:80 `
or

    ` curl --resolve "madsuchat.com:80:$INT_IP" -i madsuchat.com `




# adding metrics

helm install -f metrics.yaml metrics bitnami/metrics-server --version 6.4.3
#kc edit deployment metrics-metrics-server, add a flag --kubelet-insecure-tls=true

# adding monitoring
#helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kc create ns monitoring
helm install kps -n monitoring prometheus-community/kube-prometheus-stack
kc get all -n monitoring

kc get secret -n monitoring kps-grafana -o jsonpath='{.data.admin-user}' | base64 -d
kc get secret -n monitoring kps-grafana -o jsonpath='{.data.admin-password}' | base64 -d

kc port-forward -n monitoring svc/kps-kube-prometheus-stack-prometheus 9090:9090
kc port-forward -n monitoring svc/kps-grafana 8080:80
#log in as admin/prom-operator



    ---
NGINX INGRESS SOME RETARDED WAY
    $ APP_VERSION="1.8.0"
    $ CHART_VERSION="4.7.0"
    $ mkdir nginx-ingress-controller-manifests && cd nginx-ingress-controller-manifests
    $ helm template ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --version ${CHART_VERSION} --namespace ingress-nginx > ./nginx-ingress.${APP_VERSION}.yaml
That created a manifest..
    $ kc create ns ingress-nginx
    $ kc apply -f ./nginx-ingress.${APP_VERSION}.yaml (the created yaml)
Wait for it to start.       

4. Apply the shitchat-all.yml manifest. 
    $ kkk apply -f ~/kubernetes_shit/shitchat-all.yml
5. Check for your external ip with $ kkk get svc -n ingress-nginx
    $ curl --resolve "madsuchat.com:80:$INT_IP" -i madsuchat.com
or http://192.168.1.14.nip.io/ should work

*** Adding monitoting
    $ kkk create ns monitoring
    $ export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
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

    $ minikube start

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