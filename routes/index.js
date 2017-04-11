var express = require('express');
var router = express.Router();
// schedule JSON helper
var jsdom = require('jsdom');

// schedule JSON helper
function groupBy(prop, list) {
  return list.reduce((group, item) => {
    if(!(item[prop] in group)) group[item[prop]] = [];
    group[item[prop]].push(item);
    return group;
  }, {});
}

// schedule JSON helper
function getSessionsFromNode(parentNode) {
  const sessions = Array.from(parentNode.querySelectorAll('.single-event'))
    .map(node => {
      const name = node.querySelector('.event-name').innerHTML;
      const person = node.getAttribute('data-speaker');
      const time = `${node.getAttribute('data-start')} - ${node.getAttribute('data-end')}`;
      // console.log(node.innerHTML);
      return { name, time, person };
    });
    return groupBy('time', sessions);
}

// schedule JSON helper
function parseHTML(window) {
  return Array.from(window.document.querySelectorAll('.events-group'))
    .map(node => {
      return {
        day: node.querySelector('.top-info span').innerHTML,
        sessions: getSessionsFromNode(node)
      };
    });
}

function getSessionData() {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    // schedule JSON helper
    // jsdom.env('http://codestock.org/session-schedule/', (err, window) => {
    //   fs.writeFileSync('./schedule.json', JSON.stringify(parseHTML(window)));
    //   err ? reject(err) : resolve(parseHTML(window));
    // });
    fs.readFile('schedule.json', (err, data) => {
      (err) ? reject(err) : resolve(JSON.parse(data));
    });
  });
}

async function handleRequest(req, res, next) {
  try{
    const sessions = await getSessionData();
    console.log(sessions);
    res.render('index', { title: 'CodeStock Schedule', sessions });
  } catch(err){
    res.render('index', { title: 'ERROR', sessions: [] });
  }
}

/* GET home page. */
router.get('/', handleRequest);

module.exports = router;
