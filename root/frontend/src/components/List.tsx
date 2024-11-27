export default function List() {
  fetch("http://localhost:8080/")
    .then((response) => response.json())
    .then((data) => console.log(data));

  return <></>;
}
