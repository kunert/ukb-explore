import pandas as pd
import numpy as np
import os


fpath=os.path.dirname(os.path.abspath(__file__))

test=np.array(pd.read_csv(os.path.join(fpath,'data', 'catbrowse.txt'),sep='\t'))[:,:2]
cats,relations=np.unique(test,return_inverse=True)
tf=np.reshape(relations,test.shape)
A=np.zeros([len(np.unique(tf))]*2)
for i,j in tf:
    A[i,j]=1
tops=np.where(A.sum(0)==0)[0]

cat_info=pd.read_csv(os.path.join(fpath,'data', 'category.txt'),delimiter='\t',usecols=['category_id','title','descript'])
catid,catlab=[np.array(cat_info[col]) for col in ['category_id','title']]

cat_ids=dict(zip(np.unique(relations),cats))
cat_lab=dict(zip(catid.astype(int),catlab))

def construct_tree(x):
    c=A[x]
    if sum(c)>0:
        c=np.where(c)[0]
        return ['<li id="{:}"><span class="caret"></span>{:}  {:}<ul class="nested">'.format(cat_ids[x],cat_lab[cat_ids[x]],num_fields(cat_ids[x])),[construct_tree(k) for k in c],'</ul></li>']
    return '<li id="{:}">- {:}  {:}</li>'.format(cat_ids[x],cat_lab[cat_ids[x]],num_fields(cat_ids[x]))
  
def cat_li(k):
	return '<li id="{:}">- {:}  {:}</li>'.format(k,cat_lab[k],num_fields(k))
def flatten_list(l):
    f=''
    for x in l:
        if type(x)==str:
            f+=x
        if type(x)==list:
            for xx in x:
                f+=flatten_list(xx)
    return f

def generate_phenotype_tree():
    return '<ul id="ukb_tree">'+flatten_list([construct_tree(t) for t in tops])+'</ul>'
#-- some code which takes in a keyword and outputs category numbers which are relevant in some way..
ctext=pd.read_pickle(os.path.join(fpath,'data', 'cat_info.pkl'))
def search_cats(query):
    qlist=[int (q) for q in ctext[ctext.str.contains(query.lower().replace(' ',''))].index]
    return qlist
#    
def a2str(x):
    return x[0]
df=pd.read_csv(os.path.join(fpath,'data', 'field.txt'),sep='\t',usecols=['title','field_id','main_category'])
category_to_pheno=df.groupby('main_category')['field_id'].unique().to_dict()
pheno_to_label=df.groupby('field_id')['title'].unique().apply(a2str).to_dict()
def phenotype_to_label(p):
	return [str(p),pheno_to_label[p]]
def category_to_label(t):
    phenos=category_to_pheno[t]
    return [phenotype_to_label(p) for p in phenos]

def num_fields(k):
    try:
        return '({:})'.format(len(category_to_pheno[k]))
    except KeyError:
        return ''
        
        
category_to_desc=cat_info.groupby('category_id')['descript'].unique().to_dict()
vals=[d[0] if type(d[0]) is str else '' for d in category_to_desc.values()]
cats=category_to_desc.keys()
category_to_desc=dict(zip(cats,vals))
def category_to_description(cati):
    return category_to_desc[cati]
    
    
    

