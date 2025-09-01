import { CourseTopic } from '@/types';

export type CourseTopicsFormValues = {
  course_topics: CourseTopic[];
};

export function getCourseTopicInputValues(
  values: CourseTopicsFormValues,
  initialValues: CourseTopic[],
) {
  const { course_topics } = values;
  return {
    course_topics: {
      upsert: values.course_topics,

      delete: initialValues
        ?.map((initialCourseTopic: CourseTopic) => {
          const find = course_topics?.find(
            (courseTopic: CourseTopic) =>
              courseTopic?.id === initialCourseTopic?.id,
          );
          if (!find) {
            return initialCourseTopic?.id;
          }
        })
        .filter((item?: number) => item !== undefined),
    },
  };
}
