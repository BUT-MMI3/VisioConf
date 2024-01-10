/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
export default function Events({ events }) {
  return (
    <>
      <h2>Events</h2>
      <ul>
        {events && events.length > 0 && events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </>
  );
}