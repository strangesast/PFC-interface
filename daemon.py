import os
import sys
import time
import json
import pymongo
import asyncio
import subprocess
from pymongo import MongoClient
from asyncio import create_subprocess_exec

with open('config.json', 'r') as f:
    config = json.load(f)

pfcbinarypath = os.path.join(os.path.expandvars(config['PFC_loc']), 'PFC-opt')

if not os.path.isfile(pfcbinarypath):
    print('binary not found! ({})'.format(pfcbinarypath))
    raise Exception

client = MongoClient(config['mongoDatabaseURL'])

db = client.turkey
col = db.calculations

def rem_doc_attr(_id, _attr):
    return col.update_one({'_id': _id}, {'$unset': {_attr: 1}}, upsert=False)

def set_doc_attr(_id, _attr, val):
    return col.update_one({'_id': _id}, {'$set': {_attr: val}}, upsert=False)

def set_doc_status(_id, status):
    if status not in ['pending', 'reading', 'active', 'finished', 'error']:
        raise ValueError 
    return set_doc_attr(_id, 'status', status)

@asyncio.coroutine
def start():
    while True:
        cur = col.find({"status":"pending"})
        for doc in cur:
            yield from run_for_doc(doc)

        print('sleeping...')
        yield from asyncio.sleep(1000)
        print('ready!')

@asyncio.coroutine
def create_sim_task(_id, input_file):
    path = os.path.join('calculation/', str(_id))
    inputfilepath = os.path.join(path, 'temp.i')

    with open(inputfilepath, 'w+') as f:
        f.write(input_file.replace('\r\n', '\n'))

    with open(os.path.join(path, 'current_progress.log'), 'w+') as log:
        set_doc_status(_id, 'active')
        command = [pfcbinarypath, '-i', 'temp.i']
        proc = yield from create_subprocess_exec(*command, cwd=path, stdout=log)
        set_doc_attr(_id, 'procid', int(proc.pid))
        yield from proc.wait()
        rem_doc_attr(_id, 'procid') # maybe use this for error detection (i.e. active but pid is invalid)


@asyncio.coroutine
def run_for_doc(doc):
    _id, name, input_file = doc['_id'], doc['name'], doc['input-file']
    print('reading {} calculation...'.format(repr(name)))
    if not os.path.exists('calculation'):
        os.makedirs('calculation')

    path = 'calculation/' + str(_id)

    if not os.path.exists(path):
        os.makedirs(path)

    try:
        set_doc_status(_id, 'reading')
        done, pending = yield from asyncio.wait([create_sim_task(_id, input_file)], timeout=config['max_comp_length'])
        assert not pending
        future, = done
        print(future.result())
    except:
        set_doc_status(_id, 'error')
    else:
        set_doc_status(_id, 'finished')

loop = asyncio.get_event_loop()
loop.run_until_complete(start())
