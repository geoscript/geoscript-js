package org.geoscript.js;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Rhino's doctest function doesn't handle multiple code blocks per file.
 * This parser strips doc lines (lines that aren't part of statements or 
 * result representations) to allow for multiple code blocks in a single doc
 * file.  Indentation is also stripped from code blocks & results for more
 * intelligible error reporting in test failures.
 */
public class DocParser {

    ParserState state;

    int indentation = 0;
    
    public DocParser() {
    }
    
    public String parse(String contents) {
        state = ParserState.DOC;
        String[] lines = contents.split("\\r?\\n|\\r");
        StringBuilder builder = new StringBuilder();
        String nl = System.getProperty("line.separator");
        for (String line : lines) {
            line = state.handle(this, line);
            builder.append(line + nl);
        }
        return builder.toString();
    }

    public void setState(ParserState state) {
        this.state = state;
    }

    public void setIndentation(int length) {
        this.indentation = length;
    }
    
    public int getIndentation() {
        return this.indentation;
    }

}

enum ParserState {
    DOC {
        public String handle(DocParser parser, String line) {
            String output = "";
            Matcher statementMatcher = statementPattern.matcher(line);
            if (statementMatcher.matches()) {
                int indentation = statementMatcher.group(1).length();
                parser.setIndentation(indentation);
                ParserState state = STATEMENT;
                parser.setState(state);
                output = state.handle(parser, line);
            }
            return output;
        }
    },
    STATEMENT {
        public String handle(DocParser parser, String line) {
            String output = "";
            int indentation = parser.getIndentation();
            int lineIndentation = getIndentationLevel(line);
            if (lineIndentation == indentation && (
                    line.substring(indentation).startsWith(statementPrefix) ||
                    line.substring(indentation).startsWith(continuationPrefix))) {
                output = line.substring(indentation);
            } else {
                if (lineIndentation < indentation) {
                    // less indentation implies doc
                    ParserState state = DOC;
                    parser.setState(state);
                    output = state.handle(parser, line);
                } else {
                    // same level or more indentation implies result
                    ParserState state = RESULT;
                    parser.setState(state);
                    output = state.handle(parser, line);
                }
            }
            return output;
        }
    },
    RESULT {
        public String handle(DocParser parser, String line) {
            String output = "";
            int indentation = parser.getIndentation();
            int lineIndentation = getIndentationLevel(line);
            if (lineIndentation < indentation) {
                ParserState state = DOC;
                parser.setState(state);
                output = state.handle(parser, line);
            } else {
                String sub = line.substring(indentation);
                if (line.length() > indentation && 
                        line.substring(indentation).startsWith(statementPrefix)) {
                    ParserState state = STATEMENT;
                    parser.setState(state);
                    output = state.handle(parser, line);
                } else {
                    output = sub;
                }
            }
            return output;
        }
    };
    
    abstract String handle(DocParser parser, String line);

    String statementPrefix = "js> ";
    String continuationPrefix = "  > ";
    Pattern statementPattern = Pattern.compile("^(\\s*)(" + statementPrefix + ".*)$");
    Pattern whitespacePattern = Pattern.compile("^(\\s+)");
    
    int getIndentationLevel(String line) {
        int level = 0;
        Matcher whitespaceMatcher = whitespacePattern.matcher(line);
        if (whitespaceMatcher.find()) {
            level = whitespaceMatcher.group(0).length();
        }
        return level;
    }

}
