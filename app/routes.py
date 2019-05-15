from flask import render_template,Markup,jsonify,request,make_response,send_file
from app import app
from .phenotype_info import generate_phenotype_tree,category_to_label,category_to_description,phenotype_to_label,cat_li,search_cats
import pandas as pd 

@app.route('/')
@app.route('/index')
def index():
	tree=Markup(generate_phenotype_tree())
	return render_template('index.html',tree=tree)

@app.route('/cat_fields')
def cat_fields():
	try:
		cati=request.args.get('cati',default=None,type=str)
		try:
			desc=category_to_description(int(cati))
		except:
			desc=''
		try:			
			fields=category_to_label(int(cati))
		except:
			fields=[]
		return jsonify(fields=fields,desc=desc)
	except Exception as e:
		raise e
"""
global flist		
flist=[]
@app.route('/field_list')
def field_list():
	try:
		fi=request.args.get('fi',default=None,type=str)
		addTo=request.args.get('addTo',default=None,type=str)
		if addTo=='y':
			flist.append(int(fi))
		elif addTo=='n':
			try:
				flist.remove(int(fi))
			except:
				pass
		return jsonify(plist=[phenotype_to_label(f) for f in flist])
	except Exception as e:
		raise e

@app.route('/reset_flist')
def reset_flist():
	try:
		global flist
		flist=[]
		return jsonify(flist=flist)
	except Exception as e:
		raise e
"""

@app.route('/field_list')
def field_list():
	try:
		flist=request.args.get('flist',type=str)
		if flist=='[]':
			return jsonify([])
		else:
			flist=flist.replace('[','').replace(']','').replace('"','').split(',')
			return jsonify([phenotype_to_label(int(f)) for f in flist])
	except Exception as e:
		raise e

@app.route('/download')
def download():
	flist=request.args.get('flist',type=str)
	if flist=='[]':
		return ''
	else:
		flist=flist.replace('[','').replace(']','').replace('"','').split(',')
		#df=pd.DataFrame([phenotype_to_label(int(f)) for f in flist]).to_csv(header=False,index=False,sep='\t',compression=None)
		df=[phenotype_to_label(int(f)) for f in flist]
		return jsonify(' \\n '.join(['{:},{:}'.format(a,b) for a,b in df]))
	
@app.route('/search')
def search():
	try:
		query=request.args.get('query',default=None,type=str)
		qlist=search_cats(query)
		return jsonify(results=[cat_li(k) for k in qlist])
	except Exception as e:
		raise e
