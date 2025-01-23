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

DIR=$(CDPATH='' cd -- "$(dirname -- "${this_file}")" && pwd)

BUILD_DIR="$(CDPATH='' cd -- "$(dirname -- "$(dirname -- "$(dirname -- "${this_file}")")")" && pwd)"'/dist/ng-material-scaffold/browser'

env -i DIR="${DIR}" \
       BUILD_DIR="${BUILD_DIR}" \
       LISTEN="${LISTEN:-80}"
       SERVER_NAME="${SERVER_NAME:-example.com}" \
  # A safe version of `envsubst`
  # If a var is not found it leaves it
  # env -i BAR="haz"   "FOO ${BAR} CAN" -> "FOO haz CAN"
  # env -i             "FOO ${BAR} CAN" -> "FOO ${BAR} CAN"
  envsubst_safe() {
    if [ -f "${1}" ]; then
      src="$(cat -- "${1}"; printf "a")"
      src="${src%a}"
    else
      src="${1}"
    fi
    src_len=${#src}

    eaten=0
    tmp="${src}"
    output=""

    while [ -n "${tmp}" ]; do
      rest="${tmp#?}"
      ch="${tmp%"$rest"}"
      tmp="${rest}"
      # shellcheck disable=SC2003
      eaten="$(expr "${eaten}" + 1)"

      if [ "${ch}" = "$" ]; then
        if [ -n "${tmp}" ]; then
          rest="${tmp#?}"
          next_ch="${tmp%"$rest"}"

          if [ "${next_ch}" = "{" ]; then
            tmp="${rest}"
            # shellcheck disable=SC2003
            eaten="$(expr "${eaten}" + 1)"
            var_name=""
            found_closing_brace=0
            while [ -n "${tmp}" ]; do
              rest="${tmp#?}"
              ch="${tmp%"${rest}"}"
              tmp="${rest}"
              # shellcheck disable=SC2003
              eaten="$(expr "${eaten}" + 1)"
              if [ "${ch}" = "}" ]; then
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
                var_value="$(eval "printf %s \"\${$var_name}\"")"
                output="${output}${var_value}"
              else
                output="${output}\${${var_name}}"
              fi
            fi
          elif printf "%s" "${next_ch}" | grep -q '"'"'[a-zA-Z0-9_]'"'"'; then
            var_name=""
            while [ -n "${tmp}" ]; do
              rest="${tmp#?}"
              ch="${tmp%"$rest"}"
              if printf %s "${ch}" | grep -qv '"'"'[a-zA-Z0-9_]'"'"'; then
                break
              else
                var_name="${var_name}${ch}"
                tmp="${rest}"
                # shellcheck disable=SC2003
                eaten="$(expr "${eaten}" + 1)"
              fi
            done
            if eval "[ \"\${$var_name+set}\" = \"set\" ]"; then
              var_value="$(eval "printf \"%s\" \"\${$var_name}\"")"
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
      >&2 printf "Did not parse all of src: %d != %d\n" "${eaten}" "${src_len}"
      exit 4
    fi
    printf "%s" "${output}"
  }

  LOCATION=$(envsubst_safe "${DIR}"/location.conf)
  export LOCATION
  echo ----------
  env
  envsubst_safe "${DIR}"/server.conf > "${DIR}"/server_compiled.conf

