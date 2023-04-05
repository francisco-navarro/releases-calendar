import { LitElement, html, css } from "@polymer/lit-element";
import moment from "moment";

const MAX_MONTH = 4;
const DATE_FORMAT = "DD-MM-YYYY";
const MONTH_DAY_FORMAT = "DD/MM";
const MONTH_WIDTH = 400;
const data = [
  { merge: "23-03-2023", prod: "13-04-2023", id: "Net", version: "22.0" },
  { merge: "20-04-2023", prod: "11-05-2023", id: "Net", version: "22.1" },
  { merge: "25-05-2023", prod: "08-06-2023", id: "Net", version: "22.2" },
  { merge: "08-06-2023", prod: "22-06-2023", id: "Net", version: "22.3" },
  { merge: "24-03-2023", prod: "12-04-2023", id: "Movil", version: "12.13" },
  { merge: "21-04-2023", prod: "10-05-2023", id: "Movil", version: "12.14" },
  { merge: "26-05-2023", prod: "14-06-2023", id: "Movil", version: "12.x" },
];
const sprints = [
  {},
  { start: "29-03-2023", end: "11-04-2023" },
  { start: "12-04-2023", end: "25-04-2023" },
  { start: "26-04-2023", end: "09-05-2023" },
  { start: "10-05-2023", end: "23-05-2023" },
  { start: "24-05-2023", end: "06-06-2023" },
  { start: "07-06-2023", end: "20-06-2023" },
];

export class CalendarView extends LitElement {
  static get properties() {
    return {
      mode: { type: String },
      start: { type: Object },
    };
  }

  static get styles() {
    return [
      css`
        :host {
        }
        p {
          margin: 2px;
        }
        .column {
          display: flex;
          flex-direction: column;
        }
        .monthTable {
          padding: 0.1rem;
          position: absolute;
          overflow: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .month {
          min-height: 450px;
          background-color: #dddddd;
        }
        .monthHeader {
          background-color: #3636b2;
          color: white;
          padding: 0.5rem;
          width: 400px;
          border: 1px solid gray;
          height: 1.5rem;
        }
        .version {
          position: absolute;
          border: 1px dotted black;
          border-radius: 5px;
          padding: 0 0.5rem;
        }
        .datesRow {
          font-size: 0.9rem;
          display: flex;
          justify-content: space-between;
        }
        .version.Net {
          background-color: #63a4eb;
          top: 4rem;
        }
        .version.Net.even {
          top: 7rem;
        }
        .version.Movil {
          background-color: #73c998;
          top: 12rem;
        }
        .today {
          position: absolute;
          border-left: 1px solid rgba(255, 0, 0, 0.5);
          height: 22rem;
          top: 2.8rem;
        }
        .sprint {
          position: absolute;
          border: 2px dotted #999;
          top: 0;
          margin-top: 2.75rem;
          height: 88%;
          color: #888;
        }
        .sprint div {
          padding: 0.2rem 0.1rem;
        }
        .grow {
          flex-grow: 1;
        }
        .grow2 {
          flex-grow: 2;
        }
        .fontBig {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          margin-top: 0.5rem;
          color: #999;
          transform: scale(1, 2);
        }
      `,
    ];
  }

  firstUpdated() {
    this.start = moment().startOf("month");
  }

  render() {
    return html`
      <h1>Releases</h1>
      <div class="monthTable">
        ${this.today()}${this.monthHeaders()}${this.sprints()}${this.rows()}${this.today()}
      </div>
    `;
  }

  monthHeaders() {
    const months = new Array(MAX_MONTH).fill(0);

    return months.map((m, i) => {
      const currMonth = moment().startOf("month").add(i, "months");
      return html`<div class="month">
        <div class="monthHeader">
          <span>${currMonth.format("DD-MM-YYYY")}</span>
        </div>
      </div>`;
    });
  }

  rows() {
    return data.map(({ id, version, merge, prod }, i) => {
      if (this.start) {
        const mergeDate = moment(merge, DATE_FORMAT);
        const prodDate = moment(prod, DATE_FORMAT);
        const left = Math.round(
          MONTH_WIDTH * mergeDate.diff(this.start, "months", true)
        );
        const width = Math.round(
          MONTH_WIDTH * prodDate.diff(mergeDate, "months", true)
        );

        return html`<div
          class="version ${id} ${i % 2 ? "even" : "odd"}"
          style="left:${left}px; width:${width}px;"
        >
          <p>${id} ${version}</p>
          <div class="datesRow">
            <span>merge<br />${mergeDate.format(MONTH_DAY_FORMAT)}</span
            ><span>PRO<br />${prodDate.format(MONTH_DAY_FORMAT)}</span>
          </div>
        </div>`;
      }
    });
  }

  today() {
    const left = Math.round(
      MONTH_WIDTH * moment().diff(this.start, "months", true)
    );
    return html`<div class="today" style="left:${left}px;"></div>`;
  }

  sprints() {
    return sprints.map((el, i) => {
      if (this.start && el.start) {
        const start = moment(el.start, DATE_FORMAT);
        const end = moment(el.end, DATE_FORMAT);
        const left = Math.round(
          MONTH_WIDTH * start.diff(this.start, "months", true)
        );
        const width = Math.round(
          MONTH_WIDTH * (0.015 + end.diff(start, "months", true))
        );
        return html`<div
          class="sprint column"
          style="left:${left}px; width:${width}px;"
        >
          <div class="column grow">
            <div class="grow"></div>
            <div class="datesRow">
              <span>${start.format(MONTH_DAY_FORMAT)}</span
              ><span>${end.format(MONTH_DAY_FORMAT)}</span>
            </div>
            <div class="fontBig">SPRINT ${i}</div>
          </div>
        </div>`;
      }
    });
  }
}

customElements.define("calendar-view", CalendarView);
