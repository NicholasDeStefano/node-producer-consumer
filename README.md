Node Producer/Consumer Example
==============================

This is a "simple" solution to the Producer/Consumer problem in Node. In this
system the Producer/Generator will send a series of random arithmetic
expressions (in reverse Polish notation just for fun). The Consumer/Evaluator
will accept these expressions, compute the result and then report the solution
to back to the Generator or anyone who's listening.

The Generator and Evaluator are separate services. They could have both been
HTTP servers, but it's more fun, and probably more efficient to use a socket
for server-to-server communication. The Generator is a Connect server, and the
Evaluator is the TCP sever.

Here's a story
--------------

The end-user really wants their random expression. They don't care that much
about the solution to it, and besides, the expression being evaluated could be
super complicated, and maybe it takes a long time to figure out, so it should
be processed later. We wouldn't want to waste anyone's time now would we?

The user, being technically inclined, accesses the the Producer's single
endpoint `/expression`, maybe using curl, wherin an expression is generated
and returned as _text_, not JSON. \*gasp\*. This is because, presumably, this
server is Serious Business and millions of expression-hungry, curl-enabled
users cannot get enough of their Polish notation. It's less expensive to serve
back text in this case.

Finally the Evaluator gets notified and puts the expression in a queue to
resole when it gets a spare moment. In this demonstration, the queue and the
Consumer are one in the same. There is no external queue, datastore, or
messaging system (other than the one implemented). Because of this, and
because the queue is not bounded, you could probably overrun it if you pushed
enough data at it. But IRL, we'd use something to stash that data while we're
waiting to process it.

TL;DR
-----

Here are some pictures I whipped up, for those who didn't want to read that
giant wall of text. The first is a sequence diagram:

![Sequence Diagram](http://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgTm9kZUpTIFByb2R1Y2VyL0NvbnN1bWVyIFNlcXVlbmNlIERpYWdyYW0KCkNsaWVudC0-K0hUVFAAKQk6IEdFVCAvZXhwcmVzc2lvbgoAEg0tPgAeEGVuZXJhdGUAGA8tPi0AWgY6IFRoZSAANRorU29ja2V0IACBIQg6ICpsACMNABEPLT4AIBFFbnF1ZXVlAAcjVGljayB0b2NrADMjUmVzb2x2ZSBuZXh0AHQRLT4tAIInD1ZvaWxhISBBIHIAMgZkAIFoDG5vdGUgbGVmdCBvZiAAgWARQnJvYWRjYXN0IHRvIGFueWJvZHkgbGlzdGVuaW5nCgoK&s=napkin)

And an activity diagram which explains how the Producer basically ignores all
the rules:

![Producer activity diagram](http://www.yuml.me/da1a4d7a)

And another activity diagram which illustrates that the consumer pretty much
does what you'd expect it to do:

![Consumer activity diagram](http://www.yuml.me/1de8ebe9)

Installation
------------

Hot on the heels of all those images, you're probably hopped up to run this
thing for yourself. Here's how to make it go:

1. Clone the repo
2. Run `npm install`
3. No more steps

Proof that it works (AKA tests)
-------------------------------

Run `npm test`. A series of semi-amazing things will happen, specifically a
test which starts several instances of the Producer and procedes to DDOS the
Evaluator for about a second. It asserts that:

* The Producer is generating amazing expressions
* The Evaluator is resolving said expressions
* The Evaluator is resolving expressions in less than a second
* The expressions are valid, well-formed, reverse Polish notation
* That there's a queue, and it queues things
* etc.

Usage
-----

Alright, you want to do this the hard way.

First, start up the Consumer server with `node server.js`. Then, fire up the
a Producuer by typing `node index.js`. BAM. Fat-fingered that puppy and got
an error from the Producer? Make sure you start the Consumer first.

Next, whip out a little curl action: `curl http://localhost:8000/expression`.
You should now see a sweet expression there in the console.

By default, the Producer starts on 8000. The Evaluator is running on 9000.
If you want to fire up another Producer on a different port, you can pass a
`GENERATOR_PORT` environment variable when you start the server, e.g.
`GENERATOR_PORT=8001 node index.js`.

If you want to configure anything else, check out the configs.

License
-------

This is free software. See the LICENSE file for more information.
