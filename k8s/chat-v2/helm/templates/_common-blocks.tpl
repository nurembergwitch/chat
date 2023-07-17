{{- define "metadata" -}}
name: {{ .Values.webapp.name | default "chat "}}
namespace: {{ .Values.webapp.namespace | default "chat" }}
{{- end -}}