#-*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup

def get_html(url):

    html=requests.get(url)
    html.encoding='utf-8'#防止乱码
    soup=BeautifulSoup(html.text,'lxml')
    for h3 in soup.find_all('h3'):
        for a in h3.find_all('a'):
            title=a.get_text()
            href_1=a['href']
            contentHtml=requests.get(href_1)
            soupHtml=BeautifulSoup(contentHtml.text,'lxml')
            for div in soupHtml.find_all('div',class_='book_list'):
                for  hrefHtml in div.find_all('a'):
                    content=hrefHtml['href']#获取书名链接
                    contentRead=requests.get(content)
                    contentRead.encoding='utf-8'
                    soupcontent=BeautifulSoup(contentRead.text,'lxml')#获取文本链接

                    try:
                        with open('./jinyong/%s.txt'%title, 'a',encoding='utf-8')as f:
                            contextW=soupcontent.find(id='htmlContent').get_text()

                            f.write(contextW +'\r\n')
                    except Exception as e:
                        print(e)


url='http://jinyong.zuopinj.com'
get_html(url)
