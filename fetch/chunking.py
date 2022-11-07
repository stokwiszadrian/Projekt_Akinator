from qwikidata.json_dump import WikidataJsonDump

# You need to use Linux in order to create chunks

wjd_dump_path = "../latest-all.json.bz2"
wjd = WikidataJsonDump(wjd_dump_path)

trunc_file_name = wjd.create_chunks(num_lines_per_chunk=100000, max_chunks=2)