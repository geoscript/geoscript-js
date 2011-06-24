
# parse options
DEBUG=
while getopts 'd' OPTION; do
    case $OPTION in
    d)    DEBUG=1
    ;;
    esac
done
shift $(($OPTIND -1))

# find home
if [ -z "$0" ]; then
    # as a last recourse, use the present working directory
    GEOSCRIPT_HOME=$(pwd)
else
    # get the absolute path of the executable
    SELF_PATH=$(
        cd -P -- "$(dirname -- "$0")" \
        && pwd -P
    ) && SELF_PATH=$SELF_PATH/$(basename -- "$0")

    # resolve symlinks
    while [ -h "$SELF_PATH" ]; do
        DIR=$(dirname -- "$SELF_PATH")
        SYM=$(readlink -- "$SELF_PATH")
        SELF_PATH=$(cd -- "$DIR" && cd -- $(dirname -- "$SYM") && pwd)/$(basename -- "$SYM")
    done

    GEOSCRIPT_HOME=$(dirname -- "$(dirname -- "$SELF_PATH")")
fi

# put GeoTools jars on the classpath
CP=""
for x in `ls $GEOSCRIPT_HOME/jars/*.jar`; do
    CP=$CP:$x
done

if [ "$DEBUG" ]; then
    CLASS=org.mozilla.javascript.tools.debugger.Main
else
    CLASS=org.mozilla.javascript.tools.shell.Main
fi

if [ $# -eq 1 ]; then
    java -cp $CP $CLASS -version 170 -modules $GEOSCRIPT_HOME/lib -main $1
else
    java -cp $CP $CLASS -version 170 -modules $GEOSCRIPT_HOME/lib
fi

