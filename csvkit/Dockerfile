FROM python:3.7

RUN pip3 install --upgrade csvkit
RUN pip3 install --upgrade psycopg2-binary
RUN pip3 install --upgrade mysql-connector-python
RUN sed -i /usr/local/lib/python3.7/site-packages/csvkit/utilities/sql2csv.py -e 's|output_file, \*|output_file, delimiter="\\t", *|g'
#RUN apt update
#RUN apt install -y docker.io docker-compose jq
#RUN apt install -y moreutils
