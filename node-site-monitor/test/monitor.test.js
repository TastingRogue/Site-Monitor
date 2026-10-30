const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function setup(file, pathname='/americas.html') {
  const handlers={}, texts={}, redirects=[], attributes={};
  let authCallback, listener, cancelled, transaction, detached=0;
  const ref={on(event,cb,error){listener=cb;cancelled=error;},off(){detached++;},child(){return {transaction(update,done,local){transaction={update,done,local};}}}};
  const auth={currentUser:null,onAuthStateChanged(cb){authCallback=cb;},signOut(){return Promise.resolve();}};
  const context={document:{getElementById(){return {setAttribute(k,v){attributes[k]=v;}}}},window:{location:{pathname,replace(p){redirects.push(p);}},alert(message){texts.error=message;}},firebase:{initializeApp(){},database(){return {ref(){return ref;}}},auth(){return auth;}},$(selector){return {ready(cb){cb();},text(value){texts[selector]=value;},click(cb){handlers[selector]=cb;},keyup(){}}}};
  vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
  return {handlers,texts,redirects,attributes,signIn(){auth.currentUser={email:'test@example.com'};authCallback(auth.currentUser);},signOut(){auth.currentUser=null;authCallback(null);},snapshot(value){listener({val(){return value;}});},fail(){cancelled();},get subscribed(){return !!listener;},get transaction(){return transaction;},get detached(){return detached;}};
}
for(const file of [path.join(__dirname,'../public/javascripts/scriptAmericas.js'),path.join(__dirname,'../../web-site-monitor/public/scriptAmericas.js')]) {
  test(file+': auth, empty data, failed reads and confirmed writes',()=>{
    const app=setup(file);
    assert.equal(app.subscribed,false);
    app.signIn();
    app.snapshot(null);
    assert.equal(app.attributes['aria-disabled'],'true');
    app.snapshot({Temperature:23.5,Humidity:61,humidityAlert:1,ledStatus:0});
    assert.equal(app.texts['#temp'],'23.5 °C');
    app.handlers['#lightButton']();
    assert.equal(app.transaction.local,false);
    assert.equal(app.transaction.update(0),1);
    assert.equal(app.transaction.update(1),0);
    assert.equal(app.attributes['aria-disabled'],'true');
    app.transaction.done(new Error('denied'),false);
    assert.ok(app.texts.error);
    assert.equal(app.texts['#lightStatus'],'Luz apagada');
    app.fail();
    assert.equal(app.attributes['aria-disabled'],'true');
    app.signOut();
    assert.equal(app.detached,1);
    assert.deepEqual(app.redirects,['/']);
  });
  for(const route of ['/americas','/americas.html','/guadalajara','/manzanillo.html']) test(file+': redirect '+route,()=>{
    const app=setup(file,route);app.signOut();assert.deepEqual(app.redirects,['/']);
  });
}
test('Node templates render with installed Pug',()=>{
  const pug=require('pug');
  for(const name of ['login','americas']) assert.match(pug.renderFile(path.join(__dirname,'../views/'+name+'.pug')), /<!DOCTYPE html>/i);
});
