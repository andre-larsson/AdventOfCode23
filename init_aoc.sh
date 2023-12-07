#! /bin/bash

if [[ ! -e .env ]]
then
    echo "File .env not found! Please create it and add SESSION_ID=...."
    echo "How to find your session id (Chrome 118):"
    echo "1. Log in to adventofcode and open the developer console (F12)"
    echo "2. Go to the application tab"
    echo "3. Under storage, find the cookie named session"
    exit 1
fi

export $(grep -v '^#' .env | xargs)

DAY=$(date +"%d" -u) # day of month (utc), include leading zero e.g. 03
MONTH=$(date +"%m" -u)
YEAR=$(date +"%y" -u)

# if not december of after 25th, then use 25st of december

if [[ $MONTH != "12" ]]
then
    MONTH="12"
    DAY="01"
fi

if [[ $DAY -gt 25 ]]
then
    DAY="01"
fi

echo "This script will download the input data for an advent of code challenge, year 2023."
echo "It will also create a file for the challenge, if it does not exist."
echo "Today is day $DAY, month $MONTH, year $YEAR."
read -p "Choose a day to download input for ($DAY):" DAY_CHOICE

if [[ $DAY_CHOICE ]]
then
    DAY=$DAY_CHOICE
fi

# if day is less than two digits, add leading zero
if [[ ${#DAY} -lt 2 ]]
then
    DAY="0$DAY"
fi

echo "Will download input for day $DAY, year $YEAR."
read -p "Continue (Y/n)?" answer

if [[ $answer == "n" ]]
then
    echo "Aborting."
    exit 1
fi

# $((str)) will convert to str to number
TODAY_URL="https://adventofcode.com/2023/day/$((DAY))"
mkdir -p $DAY
curl -s -H "Cookie:session=$SESSION_ID" $TODAY_URL/input > $DAY/input.data

echo "See $DAY/input.data for input data."

# try to extract the title of today's coding challenge, and use it as filename
TODAY_TITLE=$(curl -s $TODAY_URL | grep -oP '(?<=--- ).+(?= ---)')
PRUNED_TITLE=$(echo "$TODAY_TITLE" | sed "s/[ :]//g" | sed "s/Day$((DAY))//")
NEWFILE_PATH=$DAY/$PRUNED_TITLE.mjs

if [[ $TODAY_TITLE ]]
then
    if [[ ! -e $NEWFILE_PATH ]]
    then
	cat << EOF > $NEWFILE_PATH
import { readInput } from "../shared/util.mjs"

const input = await readInput("input.data");
console.log(input);

EOF
	echo "Created file $NEWFILE_PATH"
    fi
    
else
    echo "Was not able to find title for today!"
fi

echo "Check $TODAY_URL for the description, and folder $DAY for input data and a template file."
echo "Now go and solve it! :)"
cd $DAY