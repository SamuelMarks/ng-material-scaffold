#!/bin/sh

# shellcheck disable=SC2236
if [ ! -z "${BASH_VERSION+x}" ]; then
  # shellcheck disable=SC3028 disable=SC3054
  this_file="${BASH_SOURCE[0]}"
  # shellcheck disable=SC3040
  set -o pipefail
elif [ ! -z "${ZSH_VERSION+x}" ]; then
  # shellcheck disable=SC2296
  this_file="${(%):-%x}"
  # shellcheck disable=SC3040
  set -o pipefail
else
  this_file="${0}"
fi
set -feu

# Function to save the current environment variables
save_environment() {
  ENV_SAVED_FILE=$(mktemp)
  export ENV_SAVED_FILE
  : > "$ENV_SAVED_FILE"

  env | while IFS='' read -r line || [ -n "$line" ]; do
    case "${line}" in
      *=*)
        var_name=${line%%=*}
        var_value=${line#*=}
        # Validate variable name (POSIX compliant)
        if printf '%s\n' "${var_name}" | grep -Eq '^[A-Za-z_][A-Za-z0-9_]*$'; then
          var_value=$(printf '%s' "$var_value" | sed "s/'/'\\\\''/g")
          printf 'export %s='"'"'%s'"'"'\n' "${var_name}" "${var_value}" >> "${ENV_SAVED_FILE}"
        fi
        ;;
    esac
  done
}

clear_environment() {
  env | while IFS='' read -r line || [ -n "$line" ]; do
    var_name=${line%%=*}
    unset "$var_name" || true
  done
}

save_environment

clear_environment

# A safe version of `envsubst`
# If a var is not found it leaves it
# env -i BAR='haz'   "FOO ${BAR} CAN" -> "FOO haz CAN"
# env -i             "FOO ${BAR} CAN" -> "FOO ${BAR} CAN"
envsubst_safe() {
  if [ -f "${1}" ]; then
    src="$(cat -- "${1}"; printf 'a')"
    src="${src%a}"
  else
    src="${1}"
  fi
  src_len=${#src}

  eaten=0
  tmp="${src}"
  output=''

  while [ -n "${tmp}" ]; do
    rest="${tmp#?}"
    ch="${tmp%"$rest"}"
    tmp="${rest}"
    # shellcheck disable=SC2003
    eaten="$(expr "${eaten}" + 1)"

    if [ "${ch}" = '$' ]; then
      if [ -n "${tmp}" ]; then
        rest="${tmp#?}"
        next_ch="${tmp%"$rest"}"

        if [ "${next_ch}" = '{' ]; then
          tmp="${rest}"
          # shellcheck disable=SC2003
          eaten="$(expr "${eaten}" + 1)"
          var_name=''
          found_closing_brace=0
          while [ -n "${tmp}" ]; do
            rest="${tmp#?}"
            ch="${tmp%"${rest}"}"
            tmp="${rest}"
            # shellcheck disable=SC2003
            eaten="$(expr "${eaten}" + 1)"
            if [ "${ch}" = '}' ]; then
              found_closing_brace=1
              break
            else
              var_name="${var_name}${ch}"
            fi
          done
          if [ "${found_closing_brace}" -eq 0 ]; then
            output="${output}\${${var_name}"
          else
            if eval "[ \"\${$var_name+set}\" = \"set\" ]"; then
              var_value="$(eval "printf '%s' \"\${$var_name}\"")"
              output="${output}${var_value}"
            else
              output="${output}\${${var_name}}"
            fi
          fi
        elif printf '%s' "${next_ch}" | grep -q '[a-zA-Z0-9_]'; then
          var_name=''
          while [ -n "${tmp}" ]; do
            rest="${tmp#?}"
            ch="${tmp%"$rest"}"
            if printf '%s' "${ch}" | grep -qv '[a-zA-Z0-9_]'; then
              break
            else
              var_name="${var_name}${ch}"
              tmp="${rest}"
              # shellcheck disable=SC2003
              eaten="$(expr "${eaten}" + 1)"
            fi
          done
          if eval "[ \"\${$var_name+set}\" = \"set\" ]"; then
            var_value="$(eval "printf '%s' \"\${$var_name}\"")"
            output="${output}${var_value}"
          else
            output="${output}\$${var_name}"
          fi
        else
          output="${output}\$"
        fi
      else
        output="${output}\$"
      fi
    else
      output="${output}${ch}"
    fi
  done
  if [ "${eaten}" -ne "${src_len}" ]; then
    >&2 printf 'Did not parse all of src: %d != %d\n' "${eaten}" "${src_len}"
    exit 4
  fi
  printf '%s' "${output}"
}

DIR=$(CDPATH='' cd -- "$(dirname -- "${this_file}")" && pwd)

BUILD_DIR="$(CDPATH='' cd -- "$(dirname -- "$(dirname -- "$(dirname -- "${this_file}")")")" && pwd)"'/dist/ng-material-scaffold/browser'
export BUILD_DIR
export LISTEN="${LISTEN:-80}"
export SERVER_NAME="${SERVER_NAME:-example.com}"
LOCATION=$(envsubst_safe "${DIR}"'/location.conf')
export LOCATION
envsubst_safe "${DIR}"'/server.conf' > "${DIR}"'/server_compiled.conf'

# shellcheck disable=SC1090
. "$ENV_SAVED_FILE"

rm -f "${ENV_SAVED_FILE}"
unset ENV_SAVED_FILE
