package com.sunisland.api.repository;

import com.sunisland.api.domain.FaqTopic;
import com.sunisland.api.domain.FaqTopicDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FaqTopicRepository extends MongoRepository<FaqTopicDocument, String> {
  Optional<FaqTopicDocument> findByTopic(FaqTopic topic);
}

