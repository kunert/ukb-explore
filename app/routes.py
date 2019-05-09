from flask import render_template,Markup,jsonify,request,make_response
from app import app
from phenotype_info import generate_phenotype_tree,category_to_label,category_to_description,phenotype_to_label
import pandas as pd 
@app.route('/')
@app.route('/index')
def index():
	tree=Markup(generate_phenotype_tree())
	return render_template('index.html',tree=tree)

@app.route('/cat_fields')
def cat_fields():
	try:
		cati=request.args.get('cati',default=None,type=int)
		try:
			fields=category_to_label(int(cati))
			desc=category_to_description(int(cati))
		except:
			desc=''
			fields=[]
		return jsonify(fields=fields,desc=desc)
	except Exception as e:
		raise e

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
		
@app.route('/download')
def download():
	df=pd.DataFrame([phenotype_to_label(f) for f in flist]).to_csv(header=False,index=False)
	resp = make_response(df)
	resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
	resp.headers["Content-Type"] = "text/csv"
	return resp