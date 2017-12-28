%% greeting example

-module(greet).

%% compile attribute specified, ignore export attr
-export([hello/0, add/2, greet_and_add_two/1, judge/1, heh_fine/0, oh_god/1, help_me/1, insert/2, weather/1]).

%% import
%% -import(io, [format/2]).

%% -compile([debug_info, export_all]).

hello() ->
   io:format("~s ~s~n", ["Hello", "World"]).

add(X, Y) -> 
    X + Y.

greet_and_add_two(C) -> 
    hello(),
    add(C, 2).


%% Guards
judge(X) when X > 5 ->
    io:format("~p greater than  5. ~n", [X]);
judge(_) ->
    io:format("X < 5.~n").

%% if(s)
%% should check if this actually works (hint: an error will be thrown)
heh_fine() ->
    if 1 =:= 1 -> works;
        true -> not_work
    end.
    %%  worng
    % if 1 =:= 2; 1 =:= 1 ->
    %     works
    % end,
    % if 1 =:= 2, 1 =:= 1 ->
    %     fails
    % end.

oh_god(N) ->
    if N =:= 2 -> might_succeed;
       true -> always_does  %% this is Erlang's if's 'else!'
    end.

%% note, this one would be better as a pattern match in function heads!
%% I'm doing it this way for the sake of the example.
help_me(Animal) ->
    Talk = if Animal == cat  -> "meow";
              Animal == beef -> "mooo";
              Animal == dog  -> "bark";
              Animal == tree -> "bark";
              true -> "fgdadfgna"
           end,
    {Animal, "says " ++ Talk ++ "!"}.


%% case of

%% c(greet).
%% greet:insert(3, []).
%% greet:insert(3, [1, 2, 4]).
%% greet:insert(3, [1, 2, 3]).
insert(X, []) -> 
    [X];
insert(X, Set) ->
    case lists:member(X, Set) of 
        true -> Set;
        false -> [X|Set]
    end.


%% c(greet).
%% greet:weather({shanghai, 20}).
%% greet:weather({shanghai, 26}).
%% greet:weather({beijing, 26}).
weather(Temp) ->
    case Temp of
        {shanghai, N} when N > 10, N < 25 ->
            "Good Temperature for Shanghai!";
        {shanghai, N} when N >= 25 ->
            "Bad Temperature for Shanghai!";
        {beijing, N} when N > 5, N < 20 ->
            "Good Temperature for Beijing!";
        _ -> 
            "Invalid record!"
    end.