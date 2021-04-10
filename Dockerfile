# build
FROM adoptopenjdk/openjdk11:jdk-11.0.10_9-alpine as build
WORKDIR /usr/src/blogish-server
COPY . .
RUN ["./gradlew", "build"]

# run
FROM adoptopenjdk/openjdk11:jdk-11.0.10_9-alpine
WORKDIR /usr/src/blogish-server
COPY --from=build /usr/src/blogish-server/build/libs/*.jar app.jar
CMD ["java", "-jar", "app.jar"]