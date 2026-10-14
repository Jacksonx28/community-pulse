import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import ts from 'typescript';
import { createElement } from 'react';
import * as jsx from 'react/jsx-runtime';
import * as react from 'react';
import * as icons from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
function module(path,imports={}){const out={};const code=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','exports',code)(name=>{if(!(name in imports))throw Error(`Unexpected import: ${name}`);return imports[name]},out);return out}
const routing=module('lib/onboarding.ts');
const brand=module('app/brand.tsx',{'react/jsx-runtime':jsx});
const Welcome=module('app/welcome-start.tsx',{'react/jsx-runtime':jsx,react,'lucide-react':icons,'./brand':brand,'@/lib/onboarding':routing}).default;
const Loader=module('app/brand-loading.tsx',{'react/jsx-runtime':jsx,'./brand':brand}).default;
for(const kind of ['Community','Project','CM']){
 assert.equal(routing.profileKind(kind),kind);
 assert.equal(new URL(routing.profileSetupHref(kind),'https://pulse.test').searchParams.get('create'),kind);
}
for(const invalid of [null,undefined,[],{},'Admin','community','https://evil.test'])assert.equal(routing.profileKind(invalid),null);
const welcome=renderToStaticMarkup(createElement(Welcome,{displayName:'Jackson Amoo',onContinue(){},onExplore(){}}));
assert.match(welcome,/Welcome, Jackson/);
for(const title of ['Represent a community / DAO','Manage a project','Work as a CM'])assert.ok(welcome.includes(title));
assert.match(welcome,/href="\/\?view=profiles&amp;create=Community"/);
assert.equal((welcome.match(/aria-pressed="true"/g)||[]).length,1);
assert.match(welcome,/I’ll explore first/);
const emailWelcome=renderToStaticMarkup(createElement(Welcome,{displayName:'person@example.test',onContinue(){},onExplore(){}}));assert.ok(!emailWelcome.includes('person@example.test'),'Email fallback is not used in the public welcome heading');
const loader=renderToStaticMarkup(createElement(Loader));assert.ok(loader.includes(renderToStaticMarkup(createElement(brand.BrandMark))),'Loading uses the real brand mark');assert.match(loader,/role="status"/);
console.log('Passed: welcome role destinations, safe role parsing, personalized greeting, email fallback, accessible selection and actual loading logo.');
