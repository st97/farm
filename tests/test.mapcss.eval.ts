import {describe, expect, it} from "vitest";
import evalparser from "../js/jsmapcss/eval.pegjs";

let p, q;

describe("mapcss.eval", () => {
  it("strings", () => {
    q = '"foo"';
    p = evalparser.parse(q);
    expect(p).to.equal("foo");
    q = "'foo'";
    p = evalparser.parse(q);
    expect(p).to.equal("foo");
  });
  it("num()", () => {
    q = 'num("12.3")';
    p = evalparser.parse(q);
    expect(p).to.equal("12.3");
    q = 'num("foo")';
    p = evalparser.parse(q);
    expect(p).to.equal("");
    q = 'num("-12.3E-1")';
    p = evalparser.parse(q);
    expect(p).to.equal("-1.23");
  });
  it("str()", () => {
    var q = "str(12.3)";
    var p = evalparser.parse(q);
    expect(p).to.equal("12.3");
  });
  it("number arithmetic", () => {
    var q = "(1+2*3-4/2-1)*2";
    var p = evalparser.parse(q);
    expect(p).to.equal("8");
  });
  it("int", () => {
    q = "int(3.1)";
    p = evalparser.parse(q);
    expect(p).to.equal("3");
    q = "int(3.9)";
    p = evalparser.parse(q);
    expect(p).to.equal("3");
    q = "int(-3.1)";
    p = evalparser.parse(q);
    expect(p).to.equal("-3");
    q = "int(-3.9)";
    p = evalparser.parse(q);
    expect(p).to.equal("-3");
  });
  it("number EIAS", () => {
    q = '"2" + 4';
    p = evalparser.parse(q);
    expect(p).to.equal("6");
    q = '"2" == 2';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
  });
  it("none", () => {
    var q = "none";
    var p = evalparser.parse(q);
    expect(p).to.equal("");
  });
  it("none aithmetic", () => {
    q = "2 + none";
    p = evalparser.parse(q);
    expect(p).to.equal("2");
    q = "2 * none";
    p = evalparser.parse(q);
    expect(p).to.equal("0");
  });
  it("none EIAS", () => {
    q = '2."" == 2';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = '2+"" == 2';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = 'none == ""';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
  });
  it("boolean", () => {
    q = "boolean(0)";
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = 'boolean("0")';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = 'boolean("no")';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = 'boolean("false")';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = 'boolean("")';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = "boolean(none)";
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = 'boolean("foobar")';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = 'boolean("yes") == boolean("true")';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
  });
  it("boolean arithmetic", () => {
    q = '"true" && "false"';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = '"true" || "false"';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = '!"true"';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
  });
  it("comparison operators", () => {
    q = "2.3 > 01.2";
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = "2 >= 2";
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = "2 < 2";
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = "1 <= 2";
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = '"2" == "2"';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = '"2" == "02"';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = '"2" == "3"';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = '"2" eq "2"';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
    q = '"2" eq "02"';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = '"2" != "02"';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = '"2" <> "02"';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = '"2" ne "2"';
    p = evalparser.parse(q);
    expect(p).to.equal("false");
    q = '"2" ne "02"';
    p = evalparser.parse(q);
    expect(p).to.equal("true");
  });
  it("general functions", () => {
    q = 'tag("_")';
    p = evalparser.parse(q, {osm_tag: () => "foo"});
    expect(p).to.equal("foo");
    q = 'cond("true", "a", "b")';
    p = evalparser.parse(q);
    expect(p).to.equal("a");
    q = 'cond("false", "a", "b")';
    p = evalparser.parse(q);
    expect(p).to.equal("b");
    q = 'any(none, "", "foo", "bar")';
    p = evalparser.parse(q);
    expect(p).to.equal("foo");
  });
  it("numeric functions", () => {
    q = "max(1,2,3)";
    p = evalparser.parse(q);
    expect(p).to.equal("3");
    q = "min(1,2,-3)";
    p = evalparser.parse(q);
    expect(p).to.equal("-3");
    q = "sqrt(16)";
    p = evalparser.parse(q);
    expect(p).to.equal("4");
  });
  it("string functions", () => {
    q = 'concat("foo","bar","asd","fasd")';
    p = evalparser.parse(q);
    expect(p).to.equal("foobarasdfasd");
    q = '"foo" . 123 . "bar"';
    p = evalparser.parse(q);
    expect(p).to.equal("foo123bar");
  });
});
