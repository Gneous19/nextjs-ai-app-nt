export type Course = {
  id: number;
  title: string;
  detail: string;
  picture: string;
};

type CourseApiResponse = {
  data: Course[];
};

const API_URL = "https://api.codingthailand.com/api/course";

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
  }

  const json: CourseApiResponse = await response.json();

  return json.data ?? [];
}
