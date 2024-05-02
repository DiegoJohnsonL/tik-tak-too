CREATE MIGRATION m1wyfjbmth6jm2tzz65w5dnndqoi4r5os6h7lm2pn24g2apfys7h5q
    ONTO m1aiz3j5pg2jsecrjxhklldndolp45ks5zsrrcshj52mij6qs5ca3a
{
  ALTER TYPE default::Game {
      ALTER LINK lastMove {
          CREATE CONSTRAINT std::exclusive;
      };
      ALTER LINK prevMove {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
