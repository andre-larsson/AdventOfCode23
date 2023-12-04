#! /bin/bash

# file .env should store the session id as
# SESSION_ID=....

export $(grep -v '^#' .env | xargs)

DAY=$(date +"%d" -u) # day of month (utc), include leading zero e.g. 03
MONTH=$(date +"%m" -u)
YEAR=$(date +"%y" -u)

echo "Will download input for day $DAY, year $YEAR."
read -p "Continue (y/N)?" answer

if [[ ! $answer =~ ^[Yy] ]]
then
    echo "Exiting..."
    exit 0
fi


# $((str)) will convert to str to number
TODAY_URL="https://adventofcode.com/2023/day/$((DAY))"
mkdir -p $DAY
curl -s -H "Cookie:session=$SESSION_ID" $TODAY_URL/input > $DAY/input.data

echo "See $DAY/input.data for input data."

# try to extract the title of today's coding challenge, and use it as filename
TODAY_TITLE=$(curl -s $TODAY_URL | grep -oP '(?<=--- ).+(?= ---)')
NEWFILE_PATH="$DAY/$(echo $TODAY_TITLE | sed 's/[ :]//g' | sed 's/Day$((DAY))//').mjs"

if [[ $TODAY_TITLE ]]
then
    if [[ ! -e $NEWFILE_PATH ]]
    then
	cat << EOF > $NEWFILE_PATH
import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");
console.log(input);

EOF
	echo "Created empty file $NEWFILE_PATH"
    fi
    
else
    echo "Was not able to find title for today!"
fi

echo "Check $TODAY_URL for the description."
echo "Now go and solve it! :)"
