import os
import time
import pymongo
import subprocess
import asyncio
from asyncio import create_subprocess_exec
from pymongo import MongoClient

client = MongoClient("mongodb://samzagrobelny.com:27017")

db = client.turkey
col = db.calculations

def set_doc_attr(_id, _attr, val):
    return col.update_one({'_id': _id}, {'$set': {_attr: val}}, upsert=False)

def set_doc_status(_id, status):
    if status not in ['pending', 'reading', 'active', 'finished']:
        raise ValueError 
    return set_doc_attr(_id, 'status', status)

def start():
    cur = col.find()
    for doc in cur:
        yield from run_for_doc(doc)

def run_for_doc(doc):
    if not os.path.exists('calculation'):
        os.makedirs('calculation')

    path = 'calculation/' + str(doc['_id'])

    if not os.path.exists(path):
        os.makedirs(path)

    with open(path + '/temp.i', 'w+') as f:
        f.write(doc['input-file'])

    set_doc_status(doc['_id'], 'reading')
    with open(path + '/current_progress.log', 'w+') as log:
        set_doc_status(doc['_id'], 'active')
        command = ['sleep', '100']
        proc = yield from create_subprocess_exec(*command, cwd=path, stdout=log)
        print("HERE")
        print(proc.pid)
        set_doc_attr(doc['_id'], 'procid', int(proc.pid))
        yield from proc.wait()
        set_doc_status(doc['_id'], 'finished')

loop = asyncio.get_event_loop()
loop.run_until_complete(start())
