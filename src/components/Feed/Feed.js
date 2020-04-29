import React, { Component } from "react";
import Parser from "rss-parser";
import Tooltip from "react-tooltip";

import "./feed.scss";

const parser = new Parser({
  customFields: {
    item: ["image"],
  },
});

class Feed extends Component {
  state = {
    rss: null,
  };

  componentDidMount() {
    // fetch data from RSS
    parser.parseURL("https://tn.com.ar/rss.xml").then(rss => {
      // console.log(rss);
      this.setState({ rss });
    });
  }

  render() {
    const { rss } = this.state;
    console.log(rss);

    // verify that exist content from rss feed
    // return null
    if (rss === null) {
      return null;
    }

    return (
      <React.Fragment>
        <div className="Feed-container">
          <div data-tip data-event="click" data-for="feeds">
            RSS
          </div>
        </div>

        <Tooltip
          className="Feed-tooltip"
          id="feeds"
          type="dark"
          effect="solid"
          overridePosition={({ _, top }, __, ___, node) => ({
            left: 10,
            top,
          })}
          place="top"
          // globalEventOff="click"
          clickable={true}
        >
          <div className="Feed">
            {rss.image && (
              <figure>
                <img src={rss.image.url} alt={rss.image.title} draggable={false} />
              </figure>
            )}

            <div className="Feed-feeds">
              {rss.items.slice(0, 10).map((feed, index) => (
                <div className="Feed-feed" key={index}>
                  {/* <figure>
                    <img src={feed.image} alt={feed.title} draggable={false} />
                  </figure> */}
                  <div className="Feed-feed--title">{feed.title}</div>
                </div>
              ))}
            </div>

            <div className="Feed-note">
              <div className="Feed-note--title">{rss.items[0].title}</div>
              {rss.items[0].image && (
                <figure>
                  <img src={rss.items[0].image} alt={rss.items[0].title} draggable={false} />
                </figure>
              )}
              <div className="Feed-note--content">{rss.items[0].content}</div>
            </div>
          </div>
        </Tooltip>
      </React.Fragment>
    );
  }
}

export default Feed;
